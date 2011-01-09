class SessionsController < ApplicationController
    before_filter :ensure_login, :only => :destroy
    before_filter :ensure_logout, :only => [:new, :create]

    def index
        redirect_to(new_session_path)
    end

    def new
        @current_session = Session.new
    end

    def create
        @current_session = Session.new(params[:session])
        if @current_session.save
            session[:id] = @current_session.id
            @current_user = @user
            #flash[:notice] = "Hello #{@current_session.user.username}, you are now logged in"
            #redirect_to(root_url)
            redirect_to(timesheets_url)# unless @user.administrator
            #redirect_to(admin_timesheets_url) if @user.administrator
        else
            render(:action => 'new')
        end
    end

    def destroy
        Session.destroy(@application_session)
        session[:id] = @current_user = nil
        #flash[:notice] = "You are now logged out"
        redirect_to(root_url)
    end
end
