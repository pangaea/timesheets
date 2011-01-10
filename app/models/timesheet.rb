class Timesheet < ActiveRecord::Base
    belongs_to :user
    has_many :timesheet_days, :order => "date_worked"

    accepts_nested_attributes_for :timesheet_days, :allow_destroy => true,
        :reject_if => proc { |attributes| attributes['date_worked'].blank? }

    #after_update :add_days

    #def add_days
    #    self.timesheet_days.
    #end
end
