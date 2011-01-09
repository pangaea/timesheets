module TimesheetsHelper

    def write_weekday(the_date)
        case the_date.wday
        when 0
            return "Sunday"
        when 1
            return "Monday"
        when 2
            return "Tuesday"
        when 3
            return "Wednesday"
        when 4
            return "Thursday"
        when 5
            return "Friday"
        when 6
            return "Saturday"
        end
    end

    def status_display(status)
        case status
        when 0
            return "PENDING"
        when 1
            return "REJECTED"
        when 2
            return "APPROVED"
        end
    end

    def convert_to_us_date_string(date_str)
        date_parts = date_str.to_s.split( /-/ )
        "#{date_parts[1]}/#{date_parts[2]}/#{date_parts[0]}"
    end

    def convert_to_time_string(mins)
        timestr = []
        meridian = "AM"
        time_in_mins = mins
        if mins >= 60
            hrs = time_in_mins / 60
            hrs = hrs.floor

            if hrs > 12
                meridian = "PM"
                hrs -= 12
            elsif hrs == 12
                meridian = "PM"
            end

            if hrs <= 9
                timestr << "0#{hrs}"
            else
                timestr << "#{hrs}"
            end
            time_in_mins %= 60
        else
            timestr.push("12")
        end
        timestr << ":"
        if time_in_mins <= 9
            timestr << "0#{time_in_mins}"
        else
            timestr << "#{time_in_mins}"
        end
        timestr << meridian
        timestr.join("")
    end

    def convert_to_hours_string(mins)
        (mins/60).round(2)
    end
end
