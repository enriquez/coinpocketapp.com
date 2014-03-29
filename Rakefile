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

end

file_list = FileList.new

task :build => :clean do
  FrontEndTasks.build(FileList::DEV_ROOT, FileList::BUILD_ROOT, FileList::INDEX_HTML)
end

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
end

task :spec => ['spec:app', 'spec:workers', 'spec:bitcoin']

namespace :server do
  task :prod => :build do
    FrontEndTasks.server(:public_dir => './build', :port => 8000)
  end
end

task :server do
  FrontEndTasks.server(:public_dir => './app', :port => 8000)
end

task :default => ['lint', 'spec']
