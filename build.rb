#!/usr/bin/env ruby
require 'fileutils'
require 'json'

def replace_version_in(path, version)
  text = File.read(path)
  text.gsub!("{version}", version)
  File.open(path, 'w') { |f| f.write(text) }
end



manifest = JSON.parse(File.read('src/manifest.json'))

puts manifest["version"]

FileUtils.rm_rf "temp"
FileUtils.mkdir "temp"

# Chrome
if system("google-chrome --pack-extension=src/ --pack-extension-key=cert.pem") == true

  FileUtils.mv "src.crx", "out/humpinator-#{manifest["version"]}.crx"
  src_files = Dir.glob('src/*')

  # --- Firefox
  files = Dir.glob('bootstrap/firefox/*')
  FileUtils.rm_rf 'temp/firefox'
  FileUtils.mkdir 'temp/firefox'
  FileUtils.cp_r files, 'temp/firefox'
  FileUtils.cp_r src_files, 'temp/firefox/data'
  FileUtils.rm 'temp/firefox/data/manifest.json'
  # set version number
  replace_version_in("temp/firefox/package.json", manifest["version"])

  system("cd temp/firefox && cfx xpi")
  FileUtils.mv "temp/firefox/humpinator.xpi", "out/humpinator-#{manifest["version"]}.xpi"
  #FileUtils.rm_rf 'temp/firefox'

  # --- Opera
  files = Dir.glob('bootstrap/opera/*')
  FileUtils.rm_rf 'temp/opera'
  FileUtils.mkdir 'temp/opera'
  FileUtils.cp_r files, 'temp/opera'

  # set version number
  replace_version_in("temp/opera/config.xml", manifest["version"])
  system("cd temp/opera && ./build.sh && cd ../..")
  FileUtils.mv "temp/humpinator.oex", "out/humpinator-#{manifest["version"]}.oex"
  #FileUtils.rm_rf 'temp/opera'

end




