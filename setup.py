import os
from setuptools import setup

LICENSE = open(os.path.join(os.path.dirname(__file__), 'LICENSE.txt')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='aptivate-django-widgets',
    version='0.1',
    packages=['aptivate_widgets'],
    include_package_data=True,
    license=LICENSE,
    description='Low-bandwidth friendly widgets for Django',
    url='https://github.com/aptivate/',
    author='Aptivate',
    author_email='info@aptivate.org',
    install_requires=['django>=1.4', 'django-floppyforms>=1.1', 'django-form-utils>=1.0'],
    classifiers=[
                'Development Status :: 3 - Alpha',
                'Environment :: Web Environment',
                'Framework :: Django',
                'Intended Audience :: Developers',
                'License :: OSI Approved :: MIT',
                'Operating System :: OS Independent',
                'Programming Language :: Python',
                'Programming Language :: Python :: 2.6',
                'Topic :: Internet :: WWW/HTTP',
                'Topic :: Internet :: WWW/HTTP :: Dynamic Content'],
)
