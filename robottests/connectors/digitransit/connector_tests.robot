*** Settings ***
Documentation     Digitraffic Live Trains API - MQTT
Library           Collections
Library           DateTime
Library           PoTLib
Library           REST         ${API_URL}

*** Variables ***
${LOCAL_TZ}                  +02:00
${TEST_ENV}                  test
${API_URL}                   https://api-${TEST_ENV}.oftrust.net
${API_PATH}                  /broker/v1/fetch-data-product
${CONNECTOR_URL}             http://localhost:8080
${CONNECTOR_PATH}            /digitransit/translator/v2/fetch
${APP_TOKEN}                 %{POT_APP_ACCESS_TOKEN}
${CLIENT_SECRET}             %{POT_CLIENT_SECRET}
${PRODUCT_CODE}              digitransit-4-test
${OPERATOR_ID}               0022
${OPERATOR_TYPE}             Organization

${VEHICLE_ID}                00876
${VEHICLE_TYPE}              Vehicle

&{OPERATOR_PARAMETERS}       idLocal=${OPERATOR_ID}
...                          @type=${OPERATOR_TYPE}

&{VEHICLE_PARAMETERS}        idLocal=${VEHICLE_ID}
...                          @type=${VEHICLE_TYPE}

&{BROKER_BODY_PARAMETERS}    operator=&{OPERATOR_PARAMETERS}
...                          vehicle=&{VEHICLE_PARAMETERS}

&{BROKER_BODY}               productCode=${PRODUCT_CODE}
...                          parameters=${BROKER_BODY_PARAMETERS}

*** Keywords ***
Fetch Data Product
    [Arguments]     ${body}
    ${signature}    Calculate PoT Signature          ${body}    ${CLIENT_SECRET}
    Log             ${signature}
    Set Headers     {"x-pot-signature": "${signature}", "x-app-token": "${APP_TOKEN}"}
    POST            ${API_PATH}                      ${body}
    Output schema   response body

Get Body
    [Arguments]          &{kwargs}
    ${body}              Copy Dictionary      ${BROKER_BODY}    deepcopy=True
    ${now}               Get Current Date     time_zone=UTC     result_format=%Y-%m-%dT%H:%M:%S+00:00
    Set To Dictionary    ${body}              timestamp         ${now}
    Set To Dictionary    ${body}              &{kwargs}
    ${json_string}=      evaluate             json.dumps(${body})   json
    [Return]             ${body}

Fetch Data Product With Timestamp
    [Arguments]            ${increment}       ${time_zone}=UTC      ${result_format}=%Y-%m-%dT%H:%M:%S.%fZ
    ${timestamp}           Get Current Date
    ...                    time_zone=${time_zone}
    ...                    result_format=${result_format}
    ...                    increment=${increment}
    ${body}                Get Body                       timestamp=${timestamp}
    Fetch Data Product     ${body}

Fetch Data Product With Timestamp 200
    [Arguments]            ${increment}       ${time_zone}=UTC      ${result_format}=%Y-%m-%dT%H:%M:%S.%fZ
    Fetch Data Product With Timestamp         ${increment}    ${time_zone}    ${result_format}
    Integer                response status                200
    Array                  response body data items       minItems=2

Fetch Data Product With Timestamp 422
    [Arguments]            ${increment}
    Fetch Data Product With Timestamp         ${increment}
    Integer    response status                422
    Integer    response body error status     422
    String     response body error message    Request timestamp not within time frame.

*** Test Cases ***
fetch, 200
    [Tags]                bug-0001
    ${body}               Get Body
    Fetch Data Product    ${body}
    Integer               response status                                                           200
    String                response body @context                                                    https://standards-ontotest.oftrust.net/v2/Context/DataProductOutput/VehicleInformation/
    Object                response body data
    Array                 response body data transportationRoute
    String                response body data transportationRoute 0 @type                            TransportationRoute
    Object                response body data transportationRoute 0 operator
    Object                response body data transportationRoute 0 vehicle location

fetch, 422, Missing data for timestamp required field
    [Tags]                 bug-0001
    ${body}                Get Body
    Pop From Dictionary    ${body}                              timestamp
    Fetch Data Product     ${body}
    Integer    response status                                  422
    Integer    response body error status                       422
    String     response body error message timestamp 0          Missing data for required field.

fetch, 422, Missing data for parameters required field
    [Tags]                 bug-0002
    ${body}                Get Body
    Pop From Dictionary    ${body}                              parameters
    Fetch Data Product     ${body}
    Integer    response status                                  502
    Integer    response body error status                       502
    Integer    response body error translator_response status   422
    String     response body error translator_response data error message parameters 0         Missing data for required field.

fetch, 422, Missing data for operator required field
    [Tags]                 bug-0003
    ${body}                Get Body
    Pop From Dictionary    ${body["parameters"]}                            operator
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.operator 0            Missing data for required field.
    String     response body error translator_response data error message parameters.operator.idLocal 0    Missing data for required field.
    String     response body error translator_response data error message parameters.operator.@type 0      Missing data for required field.

fetch, 422, Missing data for vehicle required field
    [Tags]                 bug-0004
    ${body}                Get Body
    Pop From Dictionary    ${body["parameters"]}                            vehicle
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.vehicle 0             Missing data for required field.
    String     response body error translator_response data error message parameters.vehicle.idLocal 0     Missing data for required field.
    String     response body error translator_response data error message parameters.vehicle.@type 0       Missing data for required field.

fetch, 422, Empty operator
    [Tags]                 bug-0005
    ${body}                Get Body
    Set To Dictionary      ${body["parameters"]}                operator=@{EMPTY}
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.operator.idLocal 0    Missing data for required field.
    String     response body error translator_response data error message parameters.operator.@type 0      Missing data for required field.

fetch, 422, Empty operator
    [Tags]                 bug-0006
    ${body}                Get Body
    Set To Dictionary      ${body["parameters"]}                vehicle=@{EMPTY}
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.vehicle.idLocal 0     Missing data for required field.
    String     response body error translator_response data error message parameters.vehicle.@type 0       Missing data for required field.
