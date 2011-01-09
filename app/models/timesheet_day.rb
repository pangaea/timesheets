class TimesheetDay < ActiveRecord::Base
    belongs_to :timesheet
    #default_scope :order => 'index ASC'
end
