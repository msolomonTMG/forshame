require 'sinatra'
require 'json'
require 'rest-client'
require './dev_variables' if File.exists?('./dev_variables.rb')

get '/' do
	erb :index
end

get '/api/v1/timesheetDocument' do
	timesheetDocument = get_data "https://thrillistmediagroup.atlassian.net/secure/TempoTeamBoard!timesheet.jspa?v=1&periodType=BILLING&periodView=PERIOD&period=0616"
	content_type :json
		{ :timesheetDocument => timesheetDocument }.to_json
end

def get_data(url)
	headers = {
  	:"Authorization" => "Basic #{ENV['JIRA_TOKEN']}",
  	:"Content-Type" => "application/json"
  }
	return RestClient.get( url, headers )
end
