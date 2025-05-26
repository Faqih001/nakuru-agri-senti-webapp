-- Create function to verify email
CREATE OR REPLACE FUNCTION verify_email(p_token TEXT, p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Begin transaction
    BEGIN
        -- Update email verification token
        UPDATE email_verification_tokens
        SET used_at = NOW()
        WHERE token = p_token
        AND user_id = p_user_id
        AND used_at IS NULL;

        -- Update user's email verification status and set to active
        UPDATE users
        SET email_verified = true,
            status = 'active'::user_status
        WHERE id = p_user_id;

        -- Commit transaction
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
        -- Rollback transaction on error
        ROLLBACK;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify phone
CREATE OR REPLACE FUNCTION verify_phone(p_token TEXT, p_phone_number VARCHAR, p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Begin transaction
    BEGIN
        -- Update phone verification token
        UPDATE phone_verification_tokens
        SET used_at = NOW()
        WHERE token = p_token
        AND phone_number = p_phone_number
        AND user_id = p_user_id
        AND used_at IS NULL;

        -- Update user's phone verification status
        UPDATE users
        SET phone_verified = true,
            phone_number = p_phone_number,
            status = CASE 
                WHEN email_verified = true THEN 'active'::user_status 
                ELSE status 
            END
        WHERE id = p_user_id;

        -- Commit transaction
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
        -- Rollback transaction on error
        ROLLBACK;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset password
CREATE OR REPLACE FUNCTION reset_password(p_token TEXT, p_new_password TEXT, p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Begin transaction
    BEGIN
        -- Update password reset token
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE token = p_token
        AND user_id = p_user_id
        AND used_at IS NULL;

        -- Update user's password
        UPDATE users
        SET password_hash = crypt(p_new_password, gen_salt('bf')),
            failed_login_attempts = 0,
            locked_until = NULL
        WHERE id = p_user_id;

        -- Delete all sessions for the user
        DELETE FROM user_sessions
        WHERE user_id = p_user_id;

        -- Commit transaction
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
        -- Rollback transaction on error
        ROLLBACK;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
