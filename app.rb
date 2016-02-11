require 'sinatra'
require 'json'
require 'rest-client'

get '/' do
	erb :index
end

get '/api/v1/timesheetDocument' do
	timesheetDocument = get_data "https://thrillistmediagroup.atlassian.net/secure/TempoTeamBoard!timesheet.jspa?team=14&use-ISO8061-week-numbers=false&period=0116&periodType=MONTH&periodView=PERIOD&from=&to=&exact=&span="

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
