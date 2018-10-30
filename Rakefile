require 'fileutils'

task :publish do
    # Read files in the _drafts/ directory (skips hidden files and sub directories)
    drafts  = Dir["./_drafts/*"].select {|f| !File.directory? f}

    # Show a numbered list of the name of the files.
    drafts.each_with_index do |file_name, index|
        puts "#{index + 1}) " + File.basename(file_name)
    end

    # Ask for the draft number.
    puts "Enter the number of the draft you want to publish"
    draft_number = $stdin.gets.chomp

    # Validate that the input is a number
    if draft_number != draft_number.to_i().to_s() then
        puts "Input is not a number"
        abort
    end

    # Convert to required type
    draft_number = draft_number.to_i()
    draft_index = draft_number -1

    # Validate that the draft number is not out of bounds.
    if drafts.at(draft_index) == nil then
        puts "Number does not match any listed draft"
        abort
    end

    # Get a reference to the selected draft
    draft = drafts[draft_index]

    # Build the post name.
    today = Time.now.strftime("%Y-%m-%d")
    draft_basename = File.basename(draft)
    post = "_posts/#{today}-#{draft_basename}"

    # Create the post
    FileUtils.cp(draft, post)
    puts "Draft promoted to post #{post}"

    # Delete the draft
    puts "Delete draft (#{draft_basename})? y/n"
    delete = $stdin.gets.chomp

    if delete == 'y' then
        File.delete(draft)
        puts "draft deleted. Bye."
    else
        puts "Bye."
    end
end