from google_auth_oauthlib.flow import InstalledAppFlow

def get_refresh_token():
    flow = InstalledAppFlow.from_client_secrets_file(
        'client_secret.json',
        scopes=['https://www.googleapis.com/auth/adwords']
    )
    credentials = flow.run_local_server(port=8080)

    print("\n✅ SUCCESS!")
    print("Access Token:", credentials.token)
    print("Refresh Token:", credentials.refresh_token)
    print("Client ID:", credentials.client_id)
    print("Client Secret:", credentials.client_secret)

if __name__ == '__main__':
    get_refresh_token()
