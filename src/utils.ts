export function removeUndefined(object: {}) {
  const result = {}

  for (const key in object) {
    const value = object[key]

    if (value !== undefined && value !== null && value !== 'undefined' && value !== 'null') {
      result[key] = value
    }
  }

  return result
}

export function pluralize(word: string, count: number) {
  if (count > 1 || count === 0) {
    return word + 's'
  }

  return word
}

export function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea')

  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {
  }

  document.body.removeChild(textArea)
}

export function copyTextToClipboard(text) {
  const clipboard = (navigator as any).clipboard

  if (!clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }

  clipboard.writeText(text)
}