import pandas as pd

# File paths
users_file = r"C:\Users\asiva\Downloads\User-2025-08-29 (1).csv"
long_distance_file = r"C:\Users\asiva\Downloads\LongDistanceStudents-2025-08-29 (1).csv"
output_file = "long_distance_students.csv"

# Read CSV files
df_users = pd.read_csv(users_file)
df_long_distance = pd.read_csv(long_distance_file)

# Ensure email columns are consistent
df_users['email'] = df_users['email'].str.strip().str.lower()
df_long_distance['user_email'] = df_long_distance['user_email'].str.strip().str.lower()

# Filter: Keep only users who are in long distance list
filtered_df = df_users[df_users['email'].isin(df_long_distance['user_email'])]

# Save to new CSV
filtered_df.to_csv(output_file, index=False)

print(f"Filtered list saved to {output_file}")
