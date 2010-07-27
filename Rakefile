namespace :package do
  desc "Clears package directory"
  task :clean do
    Dir.glob("package/*") do |f|
      FileUtils.remove(f, :verbose => true)
    end
  end

  desc "Prepates package files"
  task :copy do
    FILES = [
      "jquery.tipTipX.js",
      "jquery.tipTipX.css",
      "jquery.tipTipX-ie.css"
    ]

    FILES.each do |f|
      FileUtils.copy("src/#{f}", "package/#{f}")
    end
  end

  desc "Creates package/jquery.tipTip.min.js from package/jquery.tipTip.js"
  task :minify do
    `java -jar yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar package/jquery.tipTipX.js > package/jquery.tipTipX.min.js`
  end

  desc "Builds the package archive"
  task :build => [:clean, :copy, :minify]
end
