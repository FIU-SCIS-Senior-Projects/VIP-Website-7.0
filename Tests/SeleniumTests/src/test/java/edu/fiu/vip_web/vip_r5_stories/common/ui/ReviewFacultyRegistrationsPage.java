package edu.fiu.vip_web.vip_r5_stories.common.ui;

/**
 * Created by josep on 5/26/17.
 */
public class ReviewFacultyRegistrationsPage {
    public static final String XPATH_APPROVE_REGISTRATION_BUTTON_FIRST = "//td[11]/div/button";

    public static final String XPATH_REVIEW_FACULTY_REGISTRATIONS_DATE_FORMAT = "//table[1]/tbody[1]/tr[%d]/td[1]/a/input";//starting at 2
    public static final String XPATH_REVIEW_FACULTY_REGISTRATIONS_FIRST_NAME_FORMAT = "//table[1]/tbody[1]/tr[%d]/td[2]/a/input";//starting at 2
    public static final String XPATH_REJECT_REGISTRATION_BUTTON_FORMAT = "//tr[%d]/td[12]/div/button";//starting at 2
}
