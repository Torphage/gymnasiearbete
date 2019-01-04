require_relative("../logic/game.rb")
require 'json'
$game = nil

class App < Sinatra::Base


    set :public_folder, 'client'

    before() do
        if $game == nil
            $game = Game.new(2)
        end
    end

    get("/") do
        # game = Game.new(2)
        # return "<h1>Creating new game!</h1><p><a href='/p1'>Player 1</a><br><a href='/p2'>Player 2</a></p>"
        return File.read('client/index.html')
    end


    get("/p1") do
        # return "<h1>You are now player 1</h1><p><a href='/getp1'>Get data</a></p><script>#{File.read('post.js')}</script>"
        return File.read('client/game.html')
    end


    get("/p2") do
        # return "<h1>You are now player 2</h1><p><a href='/getp2'>Get data</a></p><script>#{File.read('post.js')}</script>"
        return File.read('client/game.html')
    end


    get("/getp1") do
        return $game.to_hash(0).to_json
    end


    get("/getp1/all") do
        return $game.to_hash(0, true).to_json
    end


    get("/getp2") do
        return $game.to_hash(1).to_json
    end


    get("/getp2/all") do
        return $game.to_hash(1, true).to_json
    end

    
    get("/logic/test.json") do
        headers "Content-Type" => "text/html; charset=utf8"
        return File.read('logic/test.json')
    end

    get("/newgame") do
        $game = Game.new(2)
        redirect("/p1")
    end

    get("/winner") do
      return $game.winner
    end

    get("/end_page") do
        p "########## WINNER ###########"
        p $game.winner
        return File.read('client/end_page.html')
    end

    post("/winner/:id") do
        $game.winner = params["id"]
        redirect("/end_page")
    end
    
    post("/p1") do
        p params
        $game.response(params)
        redirect("/p1")
    end


    post("/p2") do
        p params
        $game.response(params)
        redirect("/p2")
    end


    post("/testpost") do
        request.body.rewind
        p JSON.parse(request.body.read, symbolize_names: true)
        request.body.rewind
        $game.response(JSON.parse(request.body.read, symbolize_names: true))
        redirect("/p1")
    end


    get("/testpost") do
        return "<script>#{File.read('webapp/post.js')}; sendpost('/testpost', #{File.read('webapp/testjson.json')});</script>"
    end
end
