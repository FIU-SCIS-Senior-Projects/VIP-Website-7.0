package edu.fiu.vip_web.vip_r5_stories.common;

/**
 * Created by josep on 5/26/17.
 */
public class FixedTestDataRepository implements TestDataRepository {

    public String getAdminUsername() {
        
        return System.getenv("VIP_ADMIN_USERNAME");
    }

    public String getAdminPassword() {
        return System.getenv("VIP_ADMIN_PASSWORD");
    }

    public String getStudentUsername() {
        return System.getenv("VIP_STUDENT_USERNAME");
    }

    public String getStudentPassword() {
        return System.getenv("VIP_STUDENT_PASSWORD");
    }

    /**
     * note this should end in "/#/"
     * @return
     */
    public String getBaseUrl() {
        return "http://vip-web-0.ignorelist.com/#/";
    }

    public String getDownloadFolder() {
        
        if (getOS().contains("mac")) 
            return "/Users/Dafna/Downloads/"; 
        else 
            return "/home/josep";
    }
    
    public String getOS() 
    {
        return System.getProperty("os.name").toLowerCase();
    }
}
