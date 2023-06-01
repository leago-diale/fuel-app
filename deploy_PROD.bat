
@echo off
echo Compiling...
cmd /c "ng build --build-optimizer "
echo Clearing target directory
rmdir /s/q \\bfmweb03.bidvestfm.co.za\d\inetpub\wwwroot\app.bidvestfm.co.za\FuelApp
mkdir \\bfmweb03.bidvestfm.co.za\d\inetpub\wwwroot\app.bidvestfm.co.za\FuelApp
echo Copying compiled code to target directory
xcopy .\dist\fuel-app\* \\bfmweb03.bidvestfm.co.za\d\inetpub\wwwroot\app.bidvestfm.co.za\FuelApp /e /y
echo
echo Done!