# put this file in mongo/bin directory.
# when you want to start mongod, just execute this file
# requirements: ruby1.9+

require 'pathname'
dir = File.dirname Pathname.new(__FILE__).realpath
tasks = `tasklist|grep mongod`
task = tasks[0...6]
$mongod = dir + '/mongod'
def start_mongod(dbpath = 'E:/data')
  t = Thread.new { system "\"#{$mongod}\" --dbpath=#{dbpath} --rest -auth" }
  sleep(5)
end
def stop_mongod(pid)
  `taskkill /PID #{pid} /F`
end
if task != 'mongod'
  result = start_mongod
  puts 'mongod has started'
else
  pid = tasks[10..34].to_i
  result = stop_mongod pid
  puts result
end