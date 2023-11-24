package io.mosip.test.mob.inji.iosTestCases;

import io.mosip.test.mob.inji.BaseTest.BaseTest;
import io.mosip.test.mob.inji.BaseTest.IosBaseTest;
import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.pages.*;
import io.mosip.test.mob.inji.utils.TestDataReader;
import org.testng.annotations.Test;

import static org.testng.Assert.assertTrue;

public class ReceiveCardTest extends IosBaseTest {
	
	 @Test
	    public void verifyRecivedCardAndQrCode() {
		 ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

	        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
	        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

	        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
	        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

	        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
	        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

	        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
	        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

	        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
	        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), Target.IOS);

	        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
	        SettingsPage settingsPage = homePage.clickOnSettingIcon();
	        
	        ReceiveCardPage receiveCardPage = settingsPage.clickOnReceiveCard();
	        assertTrue(receiveCardPage.isReceiveCardHederDisplayed(), "Verify if QR code  header is displayed");
	        assertTrue(receiveCardPage.isWaitingForConnectionDisplayed(), "Verify if waiting for connection displayed");
	 }
	 
	 @Test
	    public void verifyRecivedCardAndQrCodeInFilipinoLanguage() {
	        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

	        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
	        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

	        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
	        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

	        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
	        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

	        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
	        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.IOS);

	        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
	        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), Target.IOS);

	        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
	        SettingsPage settingsPage = homePage.clickOnSettingIcon();

	        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
	        settingsPage.clickOnLanguage().clickOnFilipinoLanguage();

	        assertTrue(settingsPage.verifyFilipinoLanguage(), "Verify if language is changed to filipino");
	        ReceiveCardPage receiveCardPage =settingsPage.clickOnReceiveCardFilipinoLanguage();
	        
	        assertTrue(receiveCardPage.isReceiveCardHederInFilipinoLanguageDisplayed(), "Verify if QR code  header is displayed filipino");
	 }
}
