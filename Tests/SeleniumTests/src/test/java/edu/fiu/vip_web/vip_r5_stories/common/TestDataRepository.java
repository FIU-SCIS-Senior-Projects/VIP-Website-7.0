package edu.fiu.vip_web.vip_r5_stories.common;

/**
 * Created by josep on 5/26/17.
 */
public interface TestDataRepository {
    String getAdminUsername();
    String getAdminPassword();
    String getStudentUsername();
    String getStudentPassword();
    String getBaseUrl();
    String getDownloadFolder();
    String getOS(); 
}
