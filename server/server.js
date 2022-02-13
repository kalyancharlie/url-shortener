const { app } = require('./app')

const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log("App listening on http://localhost:3030")
})