import unittest


def run():
    suite = unittest.TestLoader().discover('.', pattern='test_*.py')
    unittest.TextTestRunner().run(suite)
