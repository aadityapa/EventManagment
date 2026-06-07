"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredServices = services.slice(0, 6);

export function ServicesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              What We Do
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Premium Event Services
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              End-to-end event management tailored to your vision, budget, and
              expectations.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/services">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-glow hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-semibold text-white">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="line-clamp-2 text-sm text-muted">
                      {service.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-gap group-hover:gap-2">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
