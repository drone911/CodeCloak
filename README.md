# Code Cloak
Find what part of the pentesting code/binary is being caught by anti viruses.

## Why this idea
During my penetration testing class, I discovered that the testing code and binaries I utilized were triggering alerts from Windows Anti-Malware Services. As antivirus programs typically do not specify which parts of the code or binaries are flagged, I inquired with my professor about methods to identify the specific signatures triggering the alerts. His suggestion involved employing a recursive approach to split and search through the code or binary files to pinpoint the flagged sections.

This method is not widely used as [YARA](https://www.malwarebytes.com/blog/news/2017/09/explained-yara-rules) rules specify minimum sizes, but it could still give a good starting point. 

## Screenshots
1. Landing Page:
<br/>
<p align="center">
  <img src="https://github.com/drone911/CodeCloak/blob/main/images/Landing-Page.PNG" alt="Landing Page Desktop View">
</p>
2. Detections:
<br/>
<p align="center">
  <img src="https://github.com/drone911/CodeCloak/blob/main/images/Detections-Page.PNG" alt="Detections Page Desktop View">
</p>
