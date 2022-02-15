const { app } = require('./app')
const log = require('./utils/logger')

const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    log("App listening on http://localhost:3030")
})