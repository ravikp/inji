package io.mosip.test.mob.inji.androidTestCases;

import io.mosip.test.mob.inji.BaseTest.AndroidBaseTest;
import io.mosip.test.mob.inji.constants.Target;
import org.testng.annotations.Test;
import io.mosip.test.mob.inji.pages.*;
import io.mosip.test.mob.inji.utils.TestDataReader;

import static org.testng.Assert.assertTrue;

public class UnlockWithPasscodeTest extends AndroidBaseTest {

    @Test
    public void logoutAndLoginWithPasscode() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        UnlockApplicationPage unlockApplicationPage = settingsPage.clickOnLogoutButton();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoaded(), "Verify if unlock application page is displayed");
        EnterYourPasscodePage enterYourPasscodePage = unlockApplicationPage.clickOnUnlockApplicationButton();

        assertTrue(enterYourPasscodePage.isEnterYourPasscodePageLoaded(), "Verify if enter your passcode page is displayed");
        enterYourPasscodePage.enterYourPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");

    }
    
    @Test
    public void loginWithInvalidPasscode() {
        ChooseLanguagePage chooseLanguagePage = new ChooseLanguagePage(driver);

        assertTrue(chooseLanguagePage.isChooseLanguagePageLoaded(), "Verify if choose language page is displayed");
        WelcomePage welcomePage = chooseLanguagePage.clickOnSavePreference();

        assertTrue(welcomePage.isWelcomePageLoaded(), "Verify if welcome page is loaded");
        AppUnlockMethodPage appUnlockMethodPage = welcomePage.clickOnSkipButton();

        assertTrue(appUnlockMethodPage.isAppUnlockMethodPageLoaded(), "Verify if app unlocked page is displayed");
        SetPasscode setPasscode = appUnlockMethodPage.clickOnUsePasscode();

        assertTrue(setPasscode.isSetPassCodePageLoaded(), "Verify if set passcode page is displayed");
        ConfirmPasscode confirmPasscode = setPasscode.enterPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(confirmPasscode.isConfirmPassCodePageLoaded(), "Verify if confirm passcode page is displayed");
        HomePage homePage = confirmPasscode.confirmPasscode(TestDataReader.readData("passcode"), Target.ANDROID);

        assertTrue(homePage.isHomePageLoaded(), "Verify if home page is displayed");
        SettingsPage settingsPage = homePage.clickOnSettingIcon();

        assertTrue(settingsPage.isSettingPageLoaded(), "Verify if setting page is displayed");
        UnlockApplicationPage unlockApplicationPage = settingsPage.clickOnLogoutButton();

        assertTrue(unlockApplicationPage.isUnlockApplicationPageLoaded(), "Verify if unlock application page is displayed");
        EnterYourPasscodePage enterYourPasscodePage = unlockApplicationPage.clickOnUnlockApplicationButton();

        assertTrue(enterYourPasscodePage.isEnterYourPasscodePageLoaded(), "Verify if enter your passcode page is displayed");
        enterYourPasscodePage.enterYourPasscode(TestDataReader.readData("invalidPasscode"), Target.ANDROID);

        assertTrue(confirmPasscode.isPasscodeInvalidMessageDisplayed(), "verify if invalid passcode is displayed");
    	
    }
}
