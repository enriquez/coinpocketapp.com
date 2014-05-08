require 'digest'
require 'front_end_tasks'
require 'front_end_tasks/cli'
require 'front_end_tasks/documents'

class FileList
  BUILD_ROOT   = './build'
  DEV_ROOT     = './app'
  BITCOIN_ROOT = './app/vendor/bitcoin'
  SPEC_ROOT    = './spec'

  INDEX_HTML = File.join(DEV_ROOT, 'index.html')
  WORKER_JS  = File.join(DEV_ROOT, 'js/workers/bitcoin_worker.js')

  ASSETS = [
    File.join(DEV_ROOT, 'apple-touch-icon.png'),
    File.join(DEV_ROOT, 'apple-touch-icon-76x76.png'),
    File.join(DEV_ROOT, 'apple-touch-icon-120x120.png'),
    File.join(DEV_ROOT, 'apple-touch-icon-152x152.png'),
  ]

  def base_files
    [INDEX_HTML] + ASSETS
  end

  def app_scripts
    FrontEndTasks.list_scripts(INDEX_HTML, DEV_ROOT)
  end

  def app_vendor_scripts
    app_scripts.select { |s| s.include?('/vendor/') }
  end

  def app_source_scripts
    app_scripts.reject { |s| s.include?('/vendor/') }
  end

  def app_spec_helpers
    Dir.glob(File.join(SPEC_ROOT, '/helpers/**/*.js'))
  end

  def app_specs
    Dir.glob(File.join(SPEC_ROOT, '/**/*Spec.js')) - worker_specs
  end

  def worker_script
    WORKER_JS
  end

  def worker_specs
    Dir.glob(File.join(SPEC_ROOT, '/workers/**/*Spec.js'))
  end

  def bitcoin_vendor_scripts
    sjcl_scripts = [ "sjcl.js", "bitArray.js", "codecString.js",
      "aes.js", "sha256.js", "random.js", "bn.js", "ecc.js",
      "codecBase64.js", "codecHex.js", "codecBytes.js", "hmac.js",
      "pbkdf2.js", "ccm.js", "convenience.js",
    ]

    sjcl_scripts.map { |s| File.join(DEV_ROOT, 'vendor/sjcl/core/', s) }
  end

  def bitcoin_source_scripts
    Dir.glob(File.join(DEV_ROOT, 'vendor/bitcoin/src/**/*.js'))
  end

  def bitcoin_scripts
    bitcoin_vendor_scripts + bitcoin_source_scripts
  end

  def bitcoin_specs
    Dir.glob(File.join(DEV_ROOT, 'vendor/bitcoin/spec/**/*Spec.js'))
  end

  def build_files
    Dir.glob(File.join(BUILD_ROOT, '**/*')).select { |f| File.file?(f) }
  end

end

file_list = FileList.new

task :build => :clean do
  FrontEndTasks.build(
    FileList::DEV_ROOT,
    FileList::BUILD_ROOT,
    file_list.base_files
  )
end

task :build_debug => :clean do
  FrontEndTasks.build(
    FileList::DEV_ROOT,
    FileList::BUILD_ROOT,
    file_list.base_files,
    :js_concat_only => true
  )
end

task :build_gzip => :build do
  blacklist_extensions = ['.woff', '.eot', '.gz']
  files = file_list.build_files.reject do |f|
    blacklist_extensions.include?(File.extname(f))
  end

  if files.any?
    FrontEndTasks.gzip(*files)
  end
end

task :build_prod => [:build_gzip, :manifest, :release_notes]

task :clean do
  `rm -r build`
end

namespace :lint do
  task :app do
    FrontEndTasks.lint(*file_list.app_source_scripts)
  end

  task :workers do
    FrontEndTasks.lint(file_list.worker_script)
  end

  task :bitcoin do
    FrontEndTasks.lint(*file_list.bitcoin_source_scripts)
  end

  task :build => 'rake:build' do
    build_javascripts = [
      './build/js/scripts.min.js',
      './build/js/workers/bitcoin_worker.js'
    ]
    FrontEndTasks.lint(*build_javascripts)
  end
end

task :lint => ['lint:app', 'lint:workers', 'lint:bitcoin']

namespace :spec do
  task :app do
    FrontEndTasks.spec({
      :source_files => file_list.app_scripts,
      :helper_files => file_list.app_spec_helpers,
      :spec_files   => file_list.app_specs,
      :port         => 8001
    })
  end

  task :workers do
    FrontEndTasks.spec({
      :worker_file  => file_list.worker_script,
      :public_root  => FileList::DEV_ROOT,
      :spec_files   => file_list.worker_specs,
      :port         => 8002
    })
  end

  task :bitcoin do
    FrontEndTasks.spec({
      :source_files => file_list.bitcoin_scripts,
      :spec_files   => file_list.bitcoin_specs,
      :port         => 8003
    })
  end

  task :app_build => 'rake:build' do
    FrontEndTasks.spec({
      :source_files => ['./build/js/scripts.min.js'],
      :helper_files => file_list.app_spec_helpers,
      :spec_files   => file_list.app_specs,
      :port         => 8001
    })
  end

  task :worker_build => 'rake:build' do
    FrontEndTasks.spec({
      :worker_file  => './build/js/workers/bitcoin_worker.js',
      :public_root  => FileList::BUILD_ROOT,
      :spec_files   => file_list.worker_specs,
      :port         => 8002
    })
  end

  task :build => [:app_build, :worker_build]
end

task :spec => ['spec:app', 'spec:workers', 'spec:bitcoin']

namespace :server do
  task :debug => :build_debug do
    FrontEndTasks.server(:public_dir => './build', :port => 8000)
  end

  task :prod => :build_prod do
    FrontEndTasks.server(:public_dir => './build', :port => 8000)
  end
end

task :server do
  FrontEndTasks.server(:public_dir => './app', :port => 8000)
end

task :commits, :since_tag do |task, args|
  tag = ENV["SINCE_TAG"] || args[:since_tag] || `git describe --abbrev=0 --tags`
  puts
  puts '## Commits'
  puts `git log #{tag.strip}..HEAD --oneline`
  puts
end

task :checksum => :build_gzip do
  file_hash = {}
  left_column_length = 0
  build_files = file_list.build_files.reject { |f| File.extname(f) == '.gz' }
  build_files.each do |f|
    hash = Digest::SHA256.hexdigest(File.read(f))
    file = f.gsub(FileList::BUILD_ROOT + '/', '')

    file_hash[file] = hash
    left_column_length = file.length if file.length > left_column_length
  end

  puts
  puts "## Checksums"
  puts "```"
  file_hash.each_pair do |file, hash|
    puts "#{file.ljust(left_column_length)} #{hash}"
  end
  puts "```"
end

task :manifest => :build_gzip do
  manifest_file = File.open(File.join(FileList::BUILD_ROOT, 'coinpocketapp.manifest'), 'w')
  file_hash = {}
  left_column_length = 0
  build_files = file_list.build_files.reject { |f| File.extname(f) == '.gz' || File.extname(f) == '.manifest' }
  build_files.each do |f|
    hash = Digest::SHA256.hexdigest(File.read(f))
    file = f.gsub(FileList::BUILD_ROOT + '/', '')

    file_hash[file] = hash
    left_column_length = file.length if file.length > left_column_length
  end

  manifest_file.puts "CACHE MANIFEST"
  manifest_file.puts
  manifest_file.puts "CACHE:"

  file_hash.each_pair do |file, hash|
    manifest_file.puts "#{file.ljust(left_column_length)} # #{hash}"
  end
  manifest_file.puts
  manifest_file.puts "NETWORK:"
  manifest_file.puts "*"
  manifest_file.close
end

task :release_notes => [:checksum, :commits]

task :default => ['lint', 'spec']
