'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function Success() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate a random order number
    setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Pedido Realizado com Sucesso!</CardTitle>
          <CardDescription className="text-center">
            Obrigado por sua compra. Seu pedido está sendo processado e será entregue em breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Número do Pedido:</p>
            <p className="text-2xl font-bold text-green-600">{orderNumber}</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>Um e-mail de confirmação foi enviado para o endereço fornecido.</p>
            <p>Você pode acompanhar o status do seu pedido usando o número acima.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/" passHref>
            <Button>Voltar para a Página Inicial</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

