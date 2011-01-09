# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101127085138) do

  create_table "users", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "username"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "salt"
    t.string   "encrypted_password"
    t.string   "email"
    t.boolean  "administrator"
  end

  create_table "sessions", :force => true do |t|
    t.datetime      "created_at"
    t.datetime      "updated_at"
    t.belongs_to    "user"
    t.string        "ip_address"
    t.string        "path"
  end

  create_table "timesheets", :force => true do |t|
    t.datetime      "created_at"
    t.datetime      "updated_at"
    t.belongs_to    "user"
    t.integer       "status"
  end

  create_table "timesheet_days", :force => true do |t|
    t.datetime      "created_at"
    t.datetime      "updated_at"
    t.belongs_to    "timesheet"
    t.integer       "index"
    t.date          "date_worked"
    t.string        "location"
    t.integer       "begin_time_in_minutes"
    t.integer       "end_time_in_minutes"
    t.integer       "total_time_in_minutes"
  end

end
