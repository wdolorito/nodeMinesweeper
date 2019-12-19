/*
 * Basic variable initialization
 *
 */

const pics = {
               one:       '1.png',
               two:       '2.png',
               three:     '3.png',
               four:      '4.png',
               five:      '5.png',
               six:       '6.png',
               seven:     '7.png',
               eight:     '8.png',
               bomb:      'bomb.png',
               default:   'default.png',
               empty:     'empty.png',
               exploded:  'explode.png',
               flag:      'flag.png'
             }
const baseAssetPath = '/assets/'
let tileSet = baseAssetPath + 'set1/'

let gameTimer = null
let timeCount = 0
let minesInPlay = 0
let minesFull = false
let initGame = 'novice'
let gameRunning = false
let game = {}
let games = []
let novice = {
  mines: 10,
  rows: 9,
  columns: 9
}
let intermediate = {
  mines: 40,
  rows: 16,
  columns: 16
}
let expert = {
  mines: 99,
  rows: 16,
  columns: 30
}
let gameState = []

games.push(novice)
games.push(intermediate)
games.push(expert)

/*
 * Game control functions
 *
 */

const startGame = function() {
  if(!gameTimer) {
    setupTimer()
  }
}

const endGame  = function() {
  gameRunning = false
  clearInterval(gameTimer)
  gameTimer = null
}

const resetTimer = function() {
  timeCount = 0
  $('#gameTimer').html(timeCount)
}

const setupTimer = function() {
  gameRunning = true
  gameTimer = setInterval(function() {
    timeCount++
    $('#gameTimer').html(timeCount)
  }, 1000)
}

/*
 * Game validation and outcome functions
 *
 */

const validateGame = function() {
  let expected = (game.rows * game.columns) - game.mines
  let checked = $(document).find('.game img[checked]').length
  if(checked === expected) winGame()
}

const loseGame = function() {
  endGame()
  disableTiles()
  alert('you lost')
}

const winGame = function() {
  endGame()
  disableTiles()
  alert('You won!\nScore: ' + timeCount)
}

/*
 * Tile set functions
 *
 */

const setTileSet = function(set) {
  tileSet = baseAssetPath + set
}

const refreshTileSet = function() {
  $(document).find('.game img').each(function() {
    let currImg = $(this).attr('src')
    let lastSlash = currImg.lastIndexOf('/')
    let baseImg = currImg.substr(lastSlash + 1)
    let newImg = tileSet + baseImg
    $(this).attr('src', newImg)
  })
}

const disableTiles = function() {
  $(document).find('.game img').each(function() {
    $(this).removeClass('tileImg')
    $(this).addClass('tile')
  })
}

/*
 * Game state intialization
 *
 */

const returnInitialGameBoard = function(diff) {
  let html = ''
  switch(diff) {
    case 'novice':
      game = games[0]
      break
    case 'intermediate':
      game = games[1]
      break
    case 'expert':
      game = games[2]
      break
    default:
  }
  let rows = game.rows
  let cols = game.columns
  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      html += '<img class="tileImg" src="' + tileSet + pics.default + '" xpos="' + col +'" ypos="' + row + '"></img>'
    }
    html += '<br />\n'
  }
  populateGameState(game)
  $('.game').html(html)
}

const populateGameState = function(game) {
  let len = game.rows * game.columns
  let rows = game.rows
  let cols = game.columns
  let mines = game.mines
  minesInPlay = 0
  $('#mineTotal').html(mines)
  $('#minesInPlay').html(minesInPlay)
  gameState = Array(rows)
  for(let row = 0; row < rows; row++) {
    gameState[row] = Array(cols)
    for(let col = 0; col < cols; col++) {
      gameState[row][col] = 0
    }
  }
  for(let count = 0; count < mines; count++) {
    let random = Math.floor(Math.random() * len)
    let x = Math.floor(random / cols)
    let y = random % cols
    if(gameState[x][y] === 0) {
      gameState[x][y] = 'x'
    } else {
      count--
    }
  }
  addMineCounts()
}

const addMineCounts = function() {
  let rows = gameState.length
  let cols = gameState[0].length
  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      if(gameState[row][col] !== 'x') gameState[row][col] = returnMineCount(row, col)
    }
  }
}

const returnMineCount = function(x, y) {
  let counter = 0
  // check top left
  if(gameState[x - 1] !== undefined) {
    if(gameState[x - 1][y - 1] !== undefined) {
      if(gameState[x - 1][y - 1] == 'x') counter++
    }
  }

  // check top
  if(gameState[x] !== undefined) {
    if(gameState[x][y - 1] !== undefined) {
      if(gameState[x][y - 1] == 'x') counter++
    }
  }

  // check top right
  if(gameState[x + 1] !== undefined) {
    if(gameState[x + 1][y - 1] !== undefined) {
      if(gameState[x + 1][y - 1] == 'x') counter++
    }
  }

  // check left
  if(gameState[x - 1] !== undefined) {
    if(gameState[x - 1][y] !== undefined) {
      if(gameState[x - 1][y] == 'x') counter++
    }
  }

  // check right
  if(gameState[x + 1] !== undefined) {
    if(gameState[x + 1][y] !== undefined) {
      if(gameState[x + 1][y] == 'x') counter++
    }
  }

  // check bottom left
  if(gameState[x - 1] !== undefined) {
    if(gameState[x - 1][y + 1] !== undefined) {
      if(gameState[x - 1][y + 1] == 'x') counter++
    }
  }

  // check bottom
  if(gameState[x] !== undefined) {
    if(gameState[x][y + 1] !== undefined) {
      if(gameState[x][y + 1] == 'x') counter++
    }
  }

  // check bottom right
  if(gameState[x + 1] !== undefined) {
    if(gameState[x + 1][y + 1] !== undefined) {
      if(gameState[x + 1][y + 1] == 'x') counter++
    }
  }
  return counter
}

const toggleFlag = function(tile) {
  let mines = game.mines
  if(minesInPlay <= mines) {
    let currImg = $(tile).attr('src')
    let lastSlash = currImg.lastIndexOf('/')
    let baseImg = currImg.substr(lastSlash + 1)
    switch(baseImg) {
      case 'default.png':
        if(!minesFull) {
          minesInPlay++
          if(minesInPlay > mines) minesInPlay = mines
          $(tile).attr('src', tileSet + pics.flag)
          $(tile).removeAttr('checked')
        }
        if(minesInPlay === mines) {
          minesFull = true
        } else {
          minesFull = false
        }
        break
      case 'flag.png':
        minesInPlay--
        $(tile).attr('src', tileSet + pics.default)
        $(tile).removeAttr('checked')
        if(minesInPlay < 0) minesInPlay = 0
        break
      default:
    }
  }
  $('#minesInPlay').html(minesInPlay)
}

/*
 * Game board functions
 *
 */

const revealTile = function(tile) {
  if(!gameRunning) startGame()
  let xpos = parseInt($(tile).attr('xpos'))
  let ypos = parseInt($(tile).attr('ypos'))

  let currImg = $(tile).attr('src')
  let lastSlash = currImg.lastIndexOf('/')
  let basePath = currImg.substr(0, lastSlash + 1)

  let tileVal = gameState[xpos][ypos]
  switch(tileVal) {
    case 0:
      $(tile).attr('src', basePath + pics.empty)
      let toCheckArr = []
      toCheckArr.push([xpos - 1, ypos - 1])
      toCheckArr.push([xpos, ypos - 1])
      toCheckArr.push([xpos + 1, ypos - 1])
      toCheckArr.push([xpos - 1, ypos])
      toCheckArr.push([xpos + 1, ypos])
      toCheckArr.push([xpos - 1, ypos + 1])
      toCheckArr.push([xpos , ypos + 1])
      toCheckArr.push([xpos + 1, ypos + 1])
      let len = toCheckArr.length
      for(let count = 0; count < len; count++) {
        let xpos = toCheckArr[count][0]
        let ypos = toCheckArr[count][1]
        let toCheckTile = $('img[xpos="' + xpos + '"][ypos="' + ypos + '"]')
        if(toCheckTile.length) {
          if(toCheckTile.attr('checked') === undefined) {
            $(toCheckTile.attr('checked', 'true'))
            $(tile).removeClass('tileImg')
            $(tile).addClass('tile')
            revealTile(toCheckTile)
          }
        }
      }
      break
    case 1:
      $(tile).attr('src', basePath + pics.one)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 2:
      $(tile).attr('src', basePath + pics.two)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 3:
      $(tile).attr('src', basePath + pics.three)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 4:
      $(tile).attr('src', basePath + pics.four)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 5:
      $(tile).attr('src', basePath + pics.five)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 6:
      $(tile).attr('src', basePath + pics.six)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 7:
      $(tile).attr('src', basePath + pics.seven)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 8:
      $(tile).attr('src', basePath + pics.eigth)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 'x':
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      loseGame()
      break
    default:
  }
  validateGame()
}

/*
 * Disable right click menu
 */

document.oncontextmenu = () => { // IE8 compatibility
  return false
}

window.addEventListener('contextmenu', e => {
  e.preventDefault()
}, false)

/*
 * User interaction functions
 *
 */

$(document).on('mousedown', '.tileImg', function(e) {
  switch (e.which) {
    case 1:
      let xpos = $(this).attr('xpos')
      let ypos = $(this).attr('ypos')
      revealTile($(this))
      break
    case 2:
      break
    case 3:
      toggleFlag($(this))
      break
    default:
  }
})

$('#ddDifficulty > li').click(function () {
  let diffStr = $(this).find('a').html()
  let lidx = diffStr.lastIndexOf('>')
  let diff = diffStr.substr(lidx + 1)
  $('#ddDiffTop').html(diff)
})

$('.diff').click(function() {
  endGame()
  resetTimer()
  returnInitialGameBoard($(this).attr('difficulty').trim())
  refreshTileSet()
})

$('.tsImg').click(function() {
  setTileSet($(this).attr('tileSet'))
  refreshTileSet()
})

$('#sender').click(function() {
  let name = $('#name').val()
  let email = ''
  if($('#email').hasClass('valid')) email = $('#email').val()
  let subject = $('#subjectArea').val()
  let message = $('#messageArea').val()
  if(name && email && subject && message) {
    console.log('clicked')
    data = $('form').serialize()
    $.ajax({
      url: '/',
      type: 'post',
      data: data,
      success: function() {
        $('.modal').modal('close')
        alert('Thank you for the message ' + name + '!')
        $('form').trigger('reset')
      }
    })
  } else {
    let msg = 'Please fill in your '
    if(!name) msg += '1Name2 '
    if(!email) msg += '1Email Address2 '
    if(!subject) msg += '1Subject2 '
    if(!message) msg += '1Message2 '
    msg = msg.trim()
    let count = (msg.match(/1/g) || []).length
    switch(count) {
      case 2:
      case 3:
        msg = msg.replace(/1/g, '')
        msg = msg.replace(/2/g, ',')
        msg = msg.substr(0, msg.length - 1) + '.'
        let lastComma = msg.lastIndexOf(',')
        msg = msg.substr(0, lastComma) + ' and' + msg.substr(++lastComma)
        break
      case 4:
        msg = 'You didn\'t fill anything out.  Try again.'
        break
      default:
        msg = msg.replace(/1/g, '')
        msg = msg.replace(/2/g, '.')
        break
    }
    alert(msg)
  }
})

/*
 * Initial page creation
 *
 */

$(document).ready(function () {
  $('.modal').modal()
  $('.button-collapse').sideNav()
  $('#ddDiffTop').html(initGame)
  returnInitialGameBoard(initGame)
})
