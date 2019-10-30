/**
 *
 * entrez la commande suivante:
 * npm install --save express express-session body-parser morgan cors
 * puis node server.js
 * exemple complet à l'adresse https://github.com/Musinux/first-vue-app
 */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')

const app = express()

// ces lignes (cors) sont importantes pour les sessions dans la version de développement
app.use(cors({
  credentials: true,
  origin: 'http://localhost:8080'
}))

app.use(session({
  secret: 'acakolials14', // changez cette valeur
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ne changez que si vous avez activé le https
}))

app.use(morgan('dev'))
app.use(bodyParser.json())

const path = require('path')
app.use(express.static(path.join(__dirname, '/dist')))

const users = [{
  username: 'admin',
  password: '1234'
}]

let projects = [
  {
    name: 'Projet WEB',
    creator: 'Teacher',
    description: 'Building a website with modern tooling and understanding of front-end and back-end concepts\nFront-end technologies: HTML5, CSS3, Javascript (Vue.js)\nBack-end technologies: Node.js (Express)',
    tags: ['html', 'css', 'web']
  },
  {
    name: 'Projet WEB1',
    creator: 'Teacher',
    description: 'Building a website with modern tooling and understanding of front-end and back-end concepts\nFront-end technologies: HTML5, CSS3, Javascript (Vue.js)\nBack-end technologies: Node.js (Express)',
    tags: ['html', 'css', 'web']
  },
  {
    name: 'Projet WEB2',
    creator: 'Teacher',
    description: 'Building a website with modern tooling and understanding of front-end and back-end concepts\nFront-end technologies: HTML5, CSS3, Javascript (Vue.js)\nBack-end technologies: Node.js (Express)',
    tags: ['html', 'css', 'web']
  },
  {
    name: 'Projet WEB3',
    creator: 'Teacher',
    description: 'Building a website with modern tooling and understanding of front-end and back-end concepts\nFront-end technologies: HTML5, CSS3, Javascript (Vue.js)\nBack-end technologies: Node.js (Express)',
    tags: ['html', 'css', 'web']
  },
  {
    name: 'Projet WEB4',
    creator: 'Teacher',
    description: 'Building a website with modern tooling and understanding of front-end and back-end concepts\nFront-end technologies: HTML5, CSS3, Javascript (Vue.js)\nBack-end technologies: Node.js (Express)',
    tags: ['html', 'css', 'web']
  },  {
    name: 'Projet WEB5',
    creator: 'Teacher',
    description: 'Building a website with modern tooling and understanding of front-end and back-end concepts\nFront-end technologies: HTML5, CSS3, Javascript (Vue.js)\nBack-end technologies: Node.js (Express)',
    tags: ['html', 'css', 'web']
  }
  
]

app.post('/api/login', (req, res) => {
  console.log('req.body', req.body)
  console.log('req.query', req.query)
  if (!req.session.userId) {
    const user = users.find(u => u.username === req.body.login && u.password === req.body.password)
    if (!user) {
      // gérez le cas où on n'a pas trouvé d'utilisateur correspondant
      // res.status(401)
      res.json({
        message: 'unknown login and pass',
        username: ''
      })
    } else {
      // connect the user
      req.session.userId = 1000 // connect the user, and change the id
      req.session.username = user.username
      res.json({
        message: 'connected',
        username: user.username
      })
    }
  } else {
    // res.status(401)
    res.json({
      message: 'already connected',
      username: req.session.username
    })
  }
})

app.post('/api/newaccount', (req, res) => {
  console.log('req.body', req.body)
  console.log('req.query', req.query)
  if (!req.session.userId) {
    const user = users.find(u => u.username === req.body.login && u.password === req.body.password)
    if (!user) {
      // Le compte n'existe pas
      users.push({ username: req.body.login, password: req.body.password })
      res.json({
        message: 'account created'
      })
    } else {
      // Le compte existe déjà
      res.json({
        message: 'account already exists'
      })
    }
  } else {
    res.json({
      message: 'already connected'
    })
  }
})

app.get('/api/logout', (req, res) => {
  if (!req.session.userId) {
    // res.status(401)
    res.json({
      message: 'already disconnected'
    })
  } else {
    req.session.userId = 0
    res.json({
      message: 'disconnected'
    })
  }
})

function getMatchingProjects (tags) {
  let matchingProj = []
  // Pour chaque tag demandé
  tags.forEach(tag => {
    // Pour chaque projet dans la liste
    projects.forEach(project => {
      // Si le projet contient au moins un des tags, alors on l'ajoute aux matchs
      if (!matchingProj.includes(project) && project.tags.includes(tag)) {
        matchingProj.push(project)
      }
    })
  })
  return matchingProj
}

app.post('/api/getprojects', (req, res) => {
  console.log('project req.body', req.body)
  console.log('project req.query', req.query)
  if (req.session.userId) {
    res.json({
      matchingProjects: getMatchingProjects(req.body.data.tags),
      message: 'ok'
    })
  } else {
    req.session.userId = 0
    res.json({
      message: 'not connected'
    })
  }
})

app.get('/api/admin', (req, res) => {
  if (!req.session.userId || req.session.isAdmin === false) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }

  res.json({
    message: 'congrats, you are connected'
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
