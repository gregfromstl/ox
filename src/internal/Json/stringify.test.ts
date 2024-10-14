import { Json } from 'ox'
import { expect, test } from 'vitest'

test('default', () => {
  const value = {
    foo: 'bar',
    baz: {
      value1: 69n,
      value2: 14124912949129519293629939492394239492349523949321n,
      value3: 420,
    },
  }
  const string = Json.stringify(value)
  expect(string).toEqual(
    '{"foo":"bar","baz":{"value1":"69#__bigint","value2":"14124912949129519293629939492394239492349523949321#__bigint","value3":420}}',
  )
  expect(Json.parse(string)).toEqual(value)
})

test('args: replacer', () => {
  expect(
    Json.stringify(
      {
        foo: 'bar',
        baz: {
          value: 69n,
        },
      },
      (key, value) => {
        if (key === 'value') {
          return `${value}!`
        }
        return value
      },
    ),
  ).toEqual('{"foo":"bar","baz":{"value":"69!"}}')
})

test('args: space', () => {
  expect(
    Json.stringify(
      {
        foo: 'bar',
        baz: {
          value: 69n,
        },
      },
      null,
      2,
    ),
  ).toMatchInlineSnapshot(`
    "{
      "foo": "bar",
      "baz": {
        "value": "69#__bigint"
      }
    }"
  `)
})
