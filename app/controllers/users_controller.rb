class UsersController < ApplicationController
  before_filter :ensure_login, :only => [:edit, :update, :destroy]
  before_filter :ensure_logout, :only => [:new, :create]

  def index
    #@user = User.find(:all)
  end

  def show
    #@user = User.find(params[:id])
    @user = @current_user
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    @user.administrator = true  # Force administrator flag on
    if @user.save
      @current_session = @user.sessions.create
      session[:id] = @current_session.id
      flash[:notice] = "Welcome #{@user.username}, you are now registered"
      redirect_to(root_url)
    else
      render(:action => 'new')
    end
  end

  def edit
    #@user = User.find(@user)
    #@user = User.find(params[:id])
    @user = @current_user
  end

  def update
    #@user = User.find(@user)
    #@user = User.find(params[:id])
    @user = @current_user
    params[:user][:administrator] = 1  # Force administrator flag on
    if @user.update_attributes(params[:user])
      flash[:notice] = "Your account has been updated"
      redirect_to(root_url)
    else
      render(:action => 'edit')
    end
  end

  def destroy
    #@user = User.find(params[:id])
    @user = @current_user
    User.destroy(@user)
    session[:id] = @user = nil
    flash[:notice] = "You are now unregistered"
    redirect_to(root_url)
  end
end
