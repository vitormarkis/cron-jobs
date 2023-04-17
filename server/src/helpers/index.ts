const clientInfoBlacklist = ["password", "id"]

export function filterSensetiveInfoForClient(
  response: Record<string, any> | Array<Record<string, any>>
) {
  if (Array.isArray(response)) {
    let filteredResponseArray = []

    for (let i in response) {
      let filteredObject: Record<string, any> = {}
      for (let k in response[i]) {
        if (!clientInfoBlacklist.includes(k)) {
          filteredObject[k] = response[i][k]
        }
      }
      filteredResponseArray.push(filteredObject)
    }
    return filteredResponseArray
  }

  if (isObject(response)) {
    let filteredObject: Record<string, any> = {}
    for (let k in response) {
      if (!clientInfoBlacklist.includes(k)) {
        filteredObject[k] = response[k]
      }
    }
    return filteredObject
  }
}

export function isObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
