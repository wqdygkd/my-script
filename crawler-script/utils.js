const downloadFile = async (url, filePath) => {
  return axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  }).then(response => {
    response.data.pipe(fs.createWriteStream(filePath))
  })
}
