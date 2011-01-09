class ApplicationController < ActionController::Base
    before_filter :maintain_session_and_user
    protect_from_forgery

    def ensure_login
        unless @current_user
            #flash[:notice] = "Please login to continue"
            redirect_to(new_session_path)
        end
    end

    def ensure_logout
        if @current_user
            flash[:notice] = "You must logout before you can login or register"
            redirect_to(root_url)
        end
    end

    private

    def maintain_session_and_user
        if session[:id]
            if @application_session = Session.find_by_id(session[:id])
                @application_session.update_attributes(
                    :ip_address => request.remote_addr,
                    :path => request.path_info
                )
                @current_user = @application_session.user
            else
                session[:id] = nil
                redirect_to(root_url)
            end
        end
    end

end
