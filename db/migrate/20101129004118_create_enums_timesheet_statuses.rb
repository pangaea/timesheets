class CreateEnumsTimesheetStatuses < ActiveRecord::Migration
  def self.up
    create_table :enums_timesheet_statuses do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :enums_timesheet_statuses
  end
end
