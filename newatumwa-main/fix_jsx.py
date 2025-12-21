#!/usr/bin/env python3

with open('pages/ClientDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines, 1):
    if i < 882 or i > 896:
        new_lines.append(line)

with open('pages/ClientDashboard.tsx', 'w') as f:
    f.writelines(new_lines)

print('Fixed - removed lines 882-896')
