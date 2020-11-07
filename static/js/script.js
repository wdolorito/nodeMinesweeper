/*
 * Constant global variable initialization
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
               exploded:  'exploded.png',
               flag:      'flag.png'
             }

const baseassetpath = '/assets/'

const novice = {
  mines: 10,
  rows: 9,
  columns: 9
}
const intermediate = {
  mines: 40,
  rows: 16,
  columns: 16
}
const expert = {
  mines: 99,
  rows: 16,
  columns: 30
}

const games = [novice, intermediate, expert]

/*
 * Reuseable global variable initialization
 *
 */

let tileset = baseassetpath + 'set1/'

let gametimer = null
let timecount = 0
let gamerunning = false

let minesinplay = 0
let minesFull = false
let initgame = 'novice'
let game = {}
let gamestate = []

/*
 * Game timer control functions
 *
 */

const startGame = () => {
  if(!gametimer) {
    setupTimer()
  }
}

const endGame  = () => {
  gamerunning = false
  clearInterval(gametimer)
  gametimer = null
}

const resetTimer = () => {
  timecount = 0
  $('#gameTimer').html(timecount)
}

const setupTimer = () => {
  gamerunning = true
  gametimer = setInterval(() => {
    timecount++
    $('#gameTimer').html(timecount)
  }, 1000)
}

/*
 * Game validation and outcome functions
 *
 */

const validateGame = () => {
  const expected = (game.rows * game.columns) - game.mines
  const checked = $(document).find('.game img[checked]').length
  if(checked === expected) winGame()
}

const loseGame = (row, col) => {
  endGame()
  disableTiles()
  revealMines(row, col)
  alert('You lost :(')
}

const winGame = () => {
  endGame()
  disableTiles()
  alert('You won!\nScore: ' + timecount)
}

/*
 * Tile set functions
 *
 */

const setTileSet = set => {
  tileset = baseassetpath + set
}

const refreshTileSet = () => {
  const elems = $(document).find('.game img')
  const len = elems.length
  for(let count = 0; count < len; count++) {
    const curr = elems[count]
    const currimg = $(curr).attr('src')
    const lastslash = currimg.lastIndexOf('/')
    const baseimg = currimg.substr(lastslash + 1)
    const newimg = tileset + baseimg
    $(curr).attr('src', newimg)
  }
}

const disableTiles = () => {
  const elems = $(document).find('.game img')
  const len = elems.length
  for(let count = 0; count < len; count++) {
    const curr = elems[count]
    $(curr).removeClass('tileImg')
    $(curr).addClass('tile')
  }
}

/*
 * Game state intialization
 *
 */

const returnInitialGameBoard = diff => {
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
  const rows = game.rows
  const cols = game.columns
  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      html += '<img class="tileImg" src="' + tileset + pics.default + '" row="' + row +'" col="' + col + '"></img>'
    }
    html += '<br />\n'
  }
  populateGameState(game)
  $('.game').html(html)
}

const populateGameState = game => {
  const len = game.rows * game.columns
  const rows = game.rows
  const cols = game.columns
  const mines = game.mines
  minesinplay = 0
  $('#mineTotal').html(mines)
  $('#minesInPlay').html(minesinplay)
  gamestate = new Array(rows)
  for(let row = 0; row < rows; row++) {
    gamestate[row] = new Array(cols)
    for(let col = 0; col < cols; col++) {
      gamestate[row][col] = 0
    }
  }
  for(let count = 0; count < mines; count++) {
    const random = Math.floor(Math.random() * len)
    const row = Math.floor(random / cols)
    const col = random % cols
    if(gamestate[row][col] === 0) {
      gamestate[row][col] = 'x'
    } else {
      count--
    }
  }
  addMineCounts()
}

const addMineCounts = () => {
  const rows = gamestate.length
  const cols = gamestate[0].length
  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      if(gamestate[row][col] !== 'x') gamestate[row][col] = returnMineCount(row, col)
    }
  }
}

const returnMineCount = (row, col) => {

  /*
   *       c1   c2   c3
   *
   * r1    tl   t    tr
   * r2    l    x    r
   * r3    bl   b    br
   *
   */

  let counter = 0
  // check top left
  if(gamestate[row - 1] !== undefined) {
    if(gamestate[row - 1][col - 1] !== undefined) {
      if(gamestate[row - 1][col - 1] == 'x') counter++
    }
  }

  // check top
  if(gamestate[row - 1] !== undefined) {
    if(gamestate[row - 1][col] == 'x') counter++
  }

  // check top right
  if(gamestate[row - 1] !== undefined) {
    if(gamestate[row - 1][col + 1] !== undefined) {
      if(gamestate[row - 1][col + 1] == 'x') counter++
    }
  }

  // check left
  if(gamestate[row][col - 1] !== undefined) {
    if(gamestate[row][col - 1] == 'x') counter++
  }

  // check right
  if(gamestate[row][col + 1] !== undefined) {
    if(gamestate[row][col + 1] == 'x') counter++
  }

  // check bottom left
  if(gamestate[row + 1] !== undefined) {
    if(gamestate[row + 1][col - 1] !== undefined) {
      if(gamestate[row + 1][col - 1] == 'x') counter++
    }
  }

  // check bottom
  if(gamestate[row + 1] !== undefined) {
    if(gamestate[row + 1][col] == 'x') counter++
  }

  // check bottom right
  if(gamestate[row + 1] !== undefined) {
    if(gamestate[row + 1][col + 1] !== undefined) {
      if(gamestate[row + 1][col + 1] == 'x') counter++
    }
  }
  return counter
}

const toggleFlag = tile => {
  let mines = game.mines
  if(minesinplay <= mines) {
    let currImg = $(tile).attr('src')
    let lastSlash = currImg.lastIndexOf('/')
    let baseImg = currImg.substr(lastSlash + 1)
    switch(baseImg) {
      case 'default.png':
        if(!minesFull) {
          minesinplay++
          if(minesinplay > mines) minesinplay = mines
          $(tile).attr('src', tileset + pics.flag)
          $(tile).removeAttr('checked')
        }
        if(minesinplay === mines) {
          minesFull = true
        } else {
          minesFull = false
        }
        break
      case 'flag.png':
        minesinplay--
        $(tile).attr('src', tileset + pics.default)
        $(tile).removeAttr('checked')
        if(minesinplay < 0) minesinplay = 0
        break
      default:
    }
  }
  $('#minesInPlay').html(minesinplay)
}

/*
 * Game board functions
 *
 */

const revealTile = tile => {
  if(!gamerunning) startGame()
  const row = parseInt($(tile).attr('row'))
  const col = parseInt($(tile).attr('col'))

  const currimg = $(tile).attr('src')
  const lastslash = currimg.lastIndexOf('/')
  const basepath = currimg.substr(0, lastslash + 1)

  const tileval = gamestate[row][col]
  switch(tileval) {
    case 0:
      $(tile).attr('src', basepath + pics.empty)
      let tocheckarr = []
      tocheckarr.push([row - 1, col - 1])
      tocheckarr.push([row, col - 1])
      tocheckarr.push([row + 1, col - 1])
      tocheckarr.push([row - 1, col])
      tocheckarr.push([row + 1, col])
      tocheckarr.push([row - 1, col + 1])
      tocheckarr.push([row , col + 1])
      tocheckarr.push([row + 1, col + 1])
      const len = tocheckarr.length
      for(let count = 0; count < len; count++) {
        const row = tocheckarr[count][0]
        const col = tocheckarr[count][1]
        const tochecktile = $('img[row="' + row + '"][col="' + col + '"]')
        if(tochecktile.length) {
          if(tochecktile.attr('checked') === undefined) {
            $(tochecktile.attr('checked', 'true'))
            $(tile).removeClass('tileImg')
            $(tile).addClass('tile')
            revealTile(tochecktile)
          }
        }
      }
      break
    case 1:
      $(tile).attr('src', basepath + pics.one)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 2:
      $(tile).attr('src', basepath + pics.two)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 3:
      $(tile).attr('src', basepath + pics.three)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 4:
      $(tile).attr('src', basepath + pics.four)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 5:
      $(tile).attr('src', basepath + pics.five)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 6:
      $(tile).attr('src', basepath + pics.six)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 7:
      $(tile).attr('src', basepath + pics.seven)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 8:
      $(tile).attr('src', basepath + pics.eigth)
      $(tile).attr('checked', 'true')
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      break
    case 'x':
      $(tile).attr('src', basepath + pics.exploded)
      $(tile).removeClass('tileImg')
      $(tile).addClass('tile')
      loseGame(row, col)
      break
    default:
  }
}

const revealMines = (erow, ecol) => {
  const rows = gamestate.length
  const cols = gamestate[0].length
  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      if(row !== erow && col !== ecol) {
        const val = gamestate[row][col]
        if(val === 'x') {
          const mine = $('img[row="' + row + '"][col="' + col + '"]')
          const currimg = $(mine).attr('src')
          const lastslash = currimg.lastIndexOf('/')
          const basepath = currimg.substr(0, lastslash + 1)
          $(mine).attr('src', basepath + pics.bomb)
        }
      }
    }
  }
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

$(document).on('mousedown', '.tileImg', e => {
  switch (e.which) {
    case 1:
      let xpos = $(e.currentTarget).attr('xpos')
      let ypos = $(e.currentTarget).attr('ypos')
      revealTile($(e.currentTarget))
      break
    case 2:
      break
    case 3:
      toggleFlag($(e.currentTarget))
      break
    default:
  }
  validateGame()
})

$('#ddDifficulty > li').click(e => {
  const diffstr = $(e.currentTarget).find('a').html()
  const lidx = diffstr.lastIndexOf('>')
  const diff = diffstr.substr(lidx + 1)
  $('#ddDiffTop').html(diff)
})

$('.diff').click(e => {
  endGame()
  resetTimer()
  returnInitialGameBoard($(e.currentTarget).attr('difficulty').trim())
  refreshTileSet()
})

$('.tsImg').click(e => {
  setTileSet($(e.currentTarget).attr('tileSet'))
  refreshTileSet()
})

$('#sender').click(e => {
  const name = $('#name').val()
  let email = ''
  if($('#email').hasClass('valid')) email = $('#email').val()
  const subject = $('#subjectArea').val()
  const message = $('#messageArea').val()

  if(name && email && subject && message) {
    data = $('form').serialize()
    $.ajax({
      url: '/',
      type: 'post',
      data: data,
      success: () => {
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
    const count = (msg.match(/1/g) || []).length
    switch(count) {
      case 2:
      case 3:
        msg = msg.replace(/1/g, '')
        msg = msg.replace(/2/g, ',')
        msg = msg.substr(0, msg.length - 1) + '.'
        let lastcomma = msg.lastIndexOf(',')
        msg = msg.substr(0, lastcomma) + ' and' + msg.substr(++lastcomma)
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

$(document).ready(() => {
  $('.modal').modal()
  $('.button-collapse').sideNav()
  $('#ddDiffTop').html(initgame)
  returnInitialGameBoard(initgame)
})
