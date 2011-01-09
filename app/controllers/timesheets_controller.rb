class TimesheetsController < ApplicationController

    before_filter :ensure_login
    before_filter :verify_admin_access, :only => [:show, :edit, :update, :destroy]

    # GET /timesheets
    # GET /timesheets.xml
    def index
        #@timesheets = Timesheet.all
        #@timesheets = Timesheet.find(:all)
        @timesheets = @current_user.timesheets
        respond_to do |format|
            format.html # index.html.erb
            format.xml  { render :xml => @timesheets }
        end
    end

    # GET /timesheets/1
    # GET /timesheets/1.xml
    def show
#        @timesheet = Timesheet.find(params[:id])
        respond_to do |format|
            format.html # show.html.erb
            format.xml  { render :xml => @timesheet }
            format.js{}
        end
    end

    def datepicker
        respond_to do |format|
            format.js{}
        end
    end

    # GET /timesheets/new
    # GET /timesheets/new.xml
    def new
        @timesheet = @current_user.timesheets.build
        #@timesheet.status = 0
        #day_date = Time.now
        #day_date = "2010/2/8".to_date
        day_date = params[:start].to_date unless params[:start].nil?
        day_date = Time.now if params[:start].nil?
        day_span = params[:span].to_i unless params[:span].nil?
        day_span = 14 if params[:span].nil?
        if day_date.wday <= 1
             day_span.times { |i|
                if day_date.wday > 0 && day_date.wday < 6
                    day = @timesheet.timesheet_days.build
                    day.index = i
                    day.date_worked = day_date.to_s.split(" ")[0]
                end
                day_date = day_date.tomorrow
            }

            respond_to do |format|
                #format.html # new.html.erb
                #format.xml  { render :xml => @timesheet }
                format.js{}
            end
        end
    end

    # GET /timesheets/1/edit
    def edit
#        @timesheet = Timesheet.find(params[:id])
        respond_to do |format|
            #format.html # show.html.erb
            format.js{}
        end
    end

    # POST /timesheets
    # POST /timesheets.xml
    def create
        #@timesheet = Timesheet.new(params[:timesheet])
        @timesheet = @current_user.timesheets.build(params[:timesheet])
        @timesheet.status = 0
        #@day = @timesheet.timesheet_days.build
        #@day.date_worked = Time.now
        #@day.begin_time_in_minutes = 60
        #@day.end_time_in_minutes = 120
        #@day.total_time_in_minutes = 60
        #@day.save

        respond_to do |format|
            if @timesheet.save
                format.html { redirect_to :controller => "timesheets", :action => "index", :id => @timesheet.id }
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
#        @timesheet = Timesheet.find(params[:id])
        @timesheet.status = 0
        respond_to do |format|
            if @timesheet.update_attributes(params[:timesheet])
              format.html { redirect_to :controller => "timesheets", :action => "index", :id => @timesheet.id }
              #format.xml  { render :xml => @timesheet, :status => :updated, :location => @timesheet }
            else
              format.html { render :action => "new" }
              #format.xml  { render :xml => @timesheet.errors, :status => :unprocessable_entity }
            end
        end
    end

    # DELETE /timesheets/1
    # DELETE /timesheets/1.xml
    def destroy
#        @timesheet = Timesheet.find(params[:id])
        @timesheet.destroy

        respond_to do |format|
            format.html { redirect_to(timesheets_url) }
            format.xml  { head :ok }
        end
    end

  private
    def verify_admin_access
        @timesheet = Timesheet.find(params[:id])
        if !@current_user.administrator && @timesheet.user_id != @current_user.id
            redirect_to(timesheets_url)
        end
    end

end
