class Admin::TimesheetsController < ApplicationController
    #layout "administrator"

    before_filter :verify_admin_access

    # GET /timesheets
    # GET /timesheets.xml
    def index
        @users = User.find(:all, :order => "username")
        #@timesheets = Timesheet.all
        #@timesheets = Timesheet.find(:all)

	if params["status"] && !params["status"].empty? && params["timesheet_user_id"] && !params["timesheet_user_id"].empty?
            @timesheets = Timesheet.find(:all,# :order => "(case when priority='High' then 0 when priority='Medium' then 1 when priority='Low' then 3 else priority end)",
				:conditions => ["status=? and user_id=?" , params["status"], params["timesheet_user_id"]])
	elsif params["status"] && !params["status"].empty?
            @timesheets = Timesheet.find(:all,# :order => "(case when priority='High' then 0 when priority='Medium' then 1 when priority='Low' then 3 else priority end)",
				:conditions => ["status=?" , params["status"]])
	elsif params["timesheet_user_id"] && !params["timesheet_user_id"].empty?
            @timesheets = Timesheet.find(:all,# :order => "(case when priority='High' then 0 when priority='Medium' then 1 when priority='Low' then 3 else priority end)",
				:conditions => ["user_id=?" , params["timesheet_user_id"]])
	else
            @timesheets = Timesheet.find(:all)# :order => "(case when priority='High' then 0 when priority='Medium' then 1 when priority='Low' then 3 else priority end)"
	end

        #session['status'] = params["status"] if params["status"] && !params["status"].empty?
        #session['timesheet_user_id'] = params["timesheet_user_id"] if params["timesheet_user_id"] && !params["timesheet_user_id"].empty?

        respond_to do |format|
            format.html # index.html.erb
            #format.xml  { render :xml => @timesheets }
        end
    end

    # GET /timesheets/1
    # GET /timesheets/1.xml
    def show

        #puts("==============SHOW==============")
        #puts("params[:tid]=#{params[:id]}")
        @timesheet = Timesheet.find(params[:id])
        #puts("params[:id]=#{params[:id]}")

        respond_to do |format|
            #format.html # show.html.erb
            #format.xml  { render :xml => @timesheet }
            format.js{}
        end
    end

    # GET /timesheets/new
    # GET /timesheets/new.xml
    def new
        @timesheet = Timesheet.new

        respond_to do |format|
            format.html # new.html.erb
            #format.xml  { render :xml => @timesheet }
        end
    end

    # GET /timesheets/1/edit
    def edit
        @timesheet = Timesheet.find(params[:id])
    end

    # POST /timesheets
    # POST /timesheets.xml
    def create
        @timesheet = Timesheet.new(params[:timesheet])

        respond_to do |format|
            #if @timesheet.save
                    #flash[:notice] = 'Timesheet was successfully created.'
            #	format.html { redirect_to(@timesheet) }
                    #format.xml  { render :xml => @timesheet, :status => :created, :location => @timesheet }
            #else
            #	format.html { render :action => "new" }
                    #format.xml  { render :xml => @timesheet.errors, :status => :unprocessable_entity }
            #end

            if @timesheet.save
                #format.html { redirect_to(@timesheet,	:notice => 'Timesheet was successfully created.') }
                format.html { redirect_to :controller => "admin/timesheets", :action => "show", :id => @timesheet.id }
                #format.xml  { render :xml => @timesheet, :status => :created, :location => @timesheet }
            else
                format.html { render :action => "new" }
                #format.xml  { render :xml => @timesheet.errors, :status => :unprocessable_entity }
            end
        end
    end

    # PUT /timesheets/1
    # PUT /timesheets/1.xml
    def update
        @timesheet = Timesheet.find(params[:id])

        respond_to do |format|
            if @timesheet.update_attributes(params[:timesheet])
            #flash[:notice] = 'Timesheet was successfully updated.'
            #format.html { redirect_to(@timesheet) }
            #format.xml  { head :ok }
                #session['status'] if session["status"] && session["status"].empty?
                #session['timesheet_user_id'] if session["timesheet_user_id"] && session["timesheet_user_id"].empty?
                format.html { redirect_to :controller => "admin/timesheets", :action => "index" }
              #format.xml  { render :xml => @timesheet, :status => :created, :location => @timesheet }
            else
            #format.html { render :action => "edit" }
            #format.xml  { render :xml => @timesheet.errors, :status => :unprocessable_entity }

              format.html { render :action => "new" }
              #format.xml  { render :xml => @timesheet.errors, :status => :unprocessable_entity }
            end
        end
    end

    # DELETE /timesheets/1
    # DELETE /timesheets/1.xml
    def destroy
        @timesheet = Timesheet.find(params[:id])
        @timesheet.destroy

        respond_to do |format|
            format.html { redirect_to(admin_timesheets_url) }
            #format.xml  { head :ok }
        end
    end

  private
    def verify_admin_access
        if !@current_user.administrator
            redirect_to(new_session_path)
        end
    end

end
