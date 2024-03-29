import AiFunctionsWrapper from '../ai_functions_wrapper.js'

// TODO: Get the parameters type from the function signature directly.
export default function AiFunction(description: string, parameters: any) {
  return function (
    functionsClass: typeof AiFunctionsWrapper,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    functionsClass.functions[propertyKey] = {
      function: descriptor.value,
      description,
      parameters,
    }
  }
}
