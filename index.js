const core = require("@actions/core")

let portainerUrl = core.getInput("portainerUrl")
const accessToken = core.getInput("accessToken")
const stackId = parseInt(core.getInput("stackId"))
const endpointId = parseInt(core.getInput("endpointId"))

if (isNaN(stackId)) {
  core.setFailed("Stack ID must be integer")
  process.exit(1)
}

let client

if (portainerUrl.includes("http:")) {
  client = require("http")
} else {
  client = require("https")

  if (!portainerUrl.includes("https:")) {
    portainerUrl = `https://${portainerUrl}`
  }
}

if (portainerUrl.substring(portainerUrl.length - 1) === "/") {
  portainerUrl = portainerUrl.substring(0, portainerUrl.length - 1)
}

core.setSecret(portainerUrl)
core.setSecret(accessToken)

client.get(`${portainerUrl}/api/stacks/${stackId}/file`, {
  headers: {
    "X-API-Key": accessToken
  }
}, (res) => {
  if (res.statusCode !== 200) {
    core.setFailed(res.statusMessage)
    process.exit(2)
  }

  let result = ""
  res.setEncoding("utf8")
  res.on("data", (chunk) => result = result + chunk)
  res.on("end", () => {
    let stackFileContent

    try {
      // noinspection JSUnresolvedVariable
      stackFileContent = JSON.parse(result).StackFileContent

      if (stackFileContent === undefined) {
        // noinspection ExceptionCaughtLocallyJS
        throw Error("Wrong stack file content")
      }
    } catch (error) {
      core.setFailed(error.message)
      process.exit(4)
    }

    const postData = JSON.stringify({
      pullImage: true,
      stackFileContent
    })

    const req = client.request(`${portainerUrl}/api/stacks/${stackId}` + (isNaN(endpointId) ? "" : `?endpointId=${endpointId}`), {
      method: "PUT",
      headers: {
        "X-API-Key": accessToken,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        core.setFailed(res.statusMessage)
        process.exit(2)
      }
    })
      .on("error", (error) => {
        core.setFailed(error.message)
        process.exit(3)
      })

    req.write(postData)
    req.end()
  })
})
  .on("error", (error) => {
    core.setFailed(error.message)
    process.exit(3)
  })
  .end()
