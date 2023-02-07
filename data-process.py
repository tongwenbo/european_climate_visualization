import pandas as pd

n = pd.read_excel("neu.xlsx")
dn = pd.DataFrame(n)
f = open("newfile.txt", 'w')

for i in range(len(dn.index)):
    if dn.iloc[i].values[0] == "Dresden":
        f.write("{ \"year\": " + str(dn.iloc[i].values[2]) + ", \"temp\": " + str(dn.iloc[i].values[3]) + "},\n")
