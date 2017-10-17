from django.test.runner import is_discoverable
import os

# This prevents discoverer from loading models and views, which will
# cause all sorts of random failures.
def load_tests(loader, tests, pattern):
    p = os.path.join(os.path.basename(os.path.dirname(__file__)), 'tests')
    if is_discoverable(p):
        tests.addTests(loader.discover(p))
    return tests
