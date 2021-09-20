package io.agileintelligence.ppmtool.domain;

public class ResetPasswordRequest {
    String currentPassword;
    String newPassword;
    String confirmNewPassword;
    String databaseHashedPassword;

    public String getDatabaseHashedPassword() {
        return databaseHashedPassword;
    }
    public void setDatabaseHashedPassword(String databaseHashedPassword) {
        this.databaseHashedPassword = databaseHashedPassword;
    }
    public String getCurrentPassword() {
        return currentPassword;
    }
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    public String getConfirmNewPassword() {
        return confirmNewPassword;
    }
    public void setConfirmNewPassword(String confirmNewPassword) {
        this.confirmNewPassword = confirmNewPassword;
    }
}
