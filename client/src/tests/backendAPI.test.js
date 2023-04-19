import TESTHOST from './../backend/backendAPI'

test('the url is TESTHOST', () => {
    expect(TESTHOST).toEqual('http://vcptest-env.eba-7spnf825.us-east-1.elasticbeanstalk.com')
})