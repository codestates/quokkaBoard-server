import { uuid } from 'uuidv4'

export const reformUuidv4 = () => {
  const tokens = uuid().split('-')
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]
}
