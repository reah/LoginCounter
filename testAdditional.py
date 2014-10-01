import unittest
import os
import testLib
        
class TestUser(testLib.RestTestCase):
    """Test adding users"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)

    def testAddEmptyName(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : '', 'password' : 'passw0rd'} )
        self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)

    def testAddLongName(self):
        bad = "a" * 129; 
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : bad, 'password' : 'passw0rd'} )
        self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)

    def testAddLongPassword(self):
        bad = "a" * 129; 
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'foo', 'password' : bad} )
        self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_PASSWORD)

    def testAddSame(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd' } )
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd' } )
        self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_USER_EXISTS)

    def testLogin(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd'} )
        self.assertResponse(respData, count = 2)

    def testCountLogins(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd'} )
        self.assertResponse(respData, count = 3)

    def testLoginBadName(self):
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'bad', 'password' : 'credentials'} )
        self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)

    def testLoginBadPassword(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'reah', 'password' : 'passw0rd' } )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'reah', 'password' : 'password' } )
        self.assertResponse(respData, count = None, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)
        