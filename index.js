addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})



/**
 * Fetch and log a given request object
 * @param {Request} request
 */
async function handleRequest(request) {
  var myDirectUrl = request.url
  const firstQsIndex = request.url.indexOf("?")
  if (firstQsIndex != -1) {
    myDirectUrl = request.url.substring(0, firstQsIndex)
  } else {
    return fetch(request)
  }
  const reverseUrl = myDirectUrl + "?reverse_url="
  //const reverseUrl = "https://tutorial.cloudflareworkers.com/index.html?url="
  if (request.url.includes(reverseUrl)) {
    const realUrl = request.url.replace(reverseUrl, "")
    var rootUrl = realUrl + "/"
    const firstSlashIndex = realUrl.substring(8).indexOf("/")
    if (firstSlashIndex != -1) {
      rootUrl = realUrl.substring(0, 9 + firstSlashIndex)
    }
    const lastIndex = realUrl.substring(8).lastIndexOf("/")
    var currentDirUrl = realUrl + "/"
    if (lastIndex != -1) {
      currentDirUrl = realUrl.substring(0, lastIndex + 9)
    }
    console.log("realUrl : " + realUrl)
    console.log("rootUrl : " + rootUrl)
    console.log("currentDirUrl : " + currentDirUrl)
    const newRequest = new Request(realUrl);
    // const URL = request.url;
    // const method = request.method;
    // const credentials = request.credentials;
    //console.log('Got request1', request)
    const response = await fetch(newRequest)
    // Read response body.
    if (response.ok) {
      const content_type = response.headers.get("Content-Type")
      if (content_type == "text/html") {
        let text = await response.text()

        // // Modify it.
        // let modified = text.replace(
        //     /http:/g, "https://tutorial.cloudflareworkers.com/index.html?url=http:").replace(/https:/g, "https://tutorial.cloudflareworkers.com/index.html?url=https:")
        let modified = text.replace(/src=\"\/{2}/g, "src=\"https://").replace(/href=\"\/{2}/g, "href=\"https://").replace(/src=\"\/{1}/g, "src=\"" + rootUrl).replace(/href=\"\/{1}/g, "href=\"" + rootUrl).replace(/src=\"(?!(http:|https:|\/))/g, "src=\"" + currentDirUrl).replace(/href=\"(?!(http:|https|\/))/g, "href=\"" + currentDirUrl).replace(/src=\'\/{2}/g, "src=\'https://").replace(/href=\'\/{2}/g, "href=\'https://").replace(/src=\'\/{1}/g, "src=\'" + rootUrl).replace(/href=\'\/{1}/g, "href=\'" + rootUrl).replace(/src=\'(?!(http:|https:|\/))/g, "src=\'" + currentDirUrl).replace(/href=\'(?!(http:|https|\/))/g, "href=\'" + currentDirUrl).replace(/https:/g, reverseUrl + "https:").replace(/http:/g, reverseUrl + "http:")


        const newResponse = new Response(modified, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
        })
        console.log('Got new response', modified)
        // Return modified response.
        return newResponse
      } else if (content_type == "application/javascript" || content_type == "application/json" || content_type.startsWith("text")) {
        let text = await response.text()

        let modified = text.replace(/https:/g, reverseUrl + "https:").replace(/http:/g, reverseUrl + "http:")

        const newResponse = new Response(modified, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
        })
        console.log('Got new response', modified)
        // Return modified response.
        return newResponse
      } else {
        return response
      }
    } else {
      return response
    }
  } else {
    return fetch(request)
  }


  //console.log(self.location)
  //return response
}
