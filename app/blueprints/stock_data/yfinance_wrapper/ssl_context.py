import ssl

def create_tls_context():
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ctx.options |= ssl.OP_NO_TLSv1 | ssl.OP_NO_TLSv1_1           # désactive TLS<1.2
    ctx.set_ciphers('ECDHE+AESGCM:!aNULL:!eNULL')                 # ciphers modernes
    ctx.set_alpn_protocols(['http/1.1'])                         # ALPN pour HTTP/1.1
    ctx.load_default_certs()                                     # certs système
    return ctx
